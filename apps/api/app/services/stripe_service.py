import stripe
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.mutual_match import MutualMatch
from app.models.user import User

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    def __init__(self, db: Session):
        self.db = db

    def create_chat_unlock_payment_intent(
        self, 
        user_id: int, 
        match_id: int,
        amount_cents: int = 299  # €2.99
    ) -> Dict[str, Any]:
        """Create a payment intent for unlocking chat"""
        
        # Verify match exists and user is part of it
        match = self.db.query(MutualMatch).filter(MutualMatch.id == match_id).first()
        if not match:
            raise ValueError("Match not found")
        
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Check if user is part of this match
        if match.rider_id != user_id and match.listing.horse.owner_id != user_id:
            raise ValueError("User not authorized for this match")
        
        # Check if chat is already unlocked
        if match.paid_chat:
            raise ValueError("Chat already unlocked")

        try:
            # Create payment intent
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='eur',
                payment_method_types=['card', 'ideal'],
                metadata={
                    'user_id': str(user_id),
                    'match_id': str(match_id),
                    'type': 'chat_unlock'
                },
                description=f'Chat unlock voor match #{match_id}'
            )

            return {
                'client_secret': payment_intent.client_secret,
                'payment_intent_id': payment_intent.id,
                'amount': amount_cents,
                'currency': 'eur'
            }

        except stripe.error.StripeError as e:
            raise ValueError(f"Stripe error: {str(e)}")

    def confirm_chat_unlock_payment(
        self, 
        payment_intent_id: str
    ) -> Optional[MutualMatch]:
        """Confirm payment and unlock chat"""
        
        try:
            # Retrieve payment intent from Stripe
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if payment_intent.status != 'succeeded':
                raise ValueError("Payment not successful")
            
            # Get metadata
            user_id = int(payment_intent.metadata.get('user_id'))
            match_id = int(payment_intent.metadata.get('match_id'))
            
            # Update match to unlock chat
            match = self.db.query(MutualMatch).filter(MutualMatch.id == match_id).first()
            if not match:
                raise ValueError("Match not found")
            
            match.paid_chat = True
            self.db.commit()
            self.db.refresh(match)
            
            return match

        except stripe.error.StripeError as e:
            raise ValueError(f"Stripe error: {str(e)}")
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error confirming payment: {str(e)}")

    def create_webhook_endpoint(self) -> str:
        """Create Stripe webhook endpoint (for production setup)"""
        try:
            webhook_endpoint = stripe.WebhookEndpoint.create(
                url=f"{settings.BASE_URL}/api/v1/payments/webhook",
                enabled_events=[
                    'payment_intent.succeeded',
                    'payment_intent.payment_failed',
                ]
            )
            return webhook_endpoint.secret
        except stripe.error.StripeError as e:
            raise ValueError(f"Stripe webhook error: {str(e)}")

    def handle_webhook_event(self, payload: str, sig_header: str) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise ValueError("Invalid signature")

        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # Auto-unlock chat on successful payment
            if payment_intent.metadata.get('type') == 'chat_unlock':
                try:
                    self.confirm_chat_unlock_payment(payment_intent['id'])
                except Exception as e:
                    # Log error but don't fail webhook
                    print(f"Error auto-unlocking chat: {e}")

        return {'status': 'success'}

    def get_payment_methods(self, user_id: int) -> Dict[str, Any]:
        """Get available payment methods for user"""
        return {
            'payment_methods': ['card', 'ideal'],
            'supported_currencies': ['eur'],
            'chat_unlock_price': {
                'amount': 299,
                'currency': 'eur',
                'display': '€2,99'
            }
        }
