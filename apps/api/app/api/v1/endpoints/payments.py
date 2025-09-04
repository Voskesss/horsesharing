from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.payment import (
    PaymentIntentCreate, 
    PaymentIntentResponse, 
    PaymentConfirm,
    PaymentMethodsResponse
)
from app.services.stripe_service import StripeService

router = APIRouter(tags=["payments"])

@router.get("/methods", response_model=PaymentMethodsResponse)
async def get_payment_methods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get available payment methods and pricing"""
    stripe_service = StripeService(db)
    return stripe_service.get_payment_methods(current_user.id)

@router.post("/create-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    payment_data: PaymentIntentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create payment intent for chat unlock"""
    try:
        stripe_service = StripeService(db)
        result = stripe_service.create_chat_unlock_payment_intent(
            user_id=current_user.id,
            match_id=payment_data.match_id,
            amount_cents=payment_data.amount_cents
        )
        return PaymentIntentResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/confirm")
async def confirm_payment(
    payment_data: PaymentConfirm,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Confirm payment and unlock chat"""
    try:
        stripe_service = StripeService(db)
        match = stripe_service.confirm_chat_unlock_payment(
            payment_data.payment_intent_id
        )
        return {
            "success": True,
            "match_id": match.id,
            "chat_unlocked": match.paid_chat
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Stripe webhook events"""
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        if not sig_header:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing stripe-signature header"
            )
        
        stripe_service = StripeService(db)
        result = stripe_service.handle_webhook_event(
            payload.decode('utf-8'), 
            sig_header
        )
        
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
