from pydantic import BaseModel
from typing import Optional, Dict, Any

class PaymentIntentCreate(BaseModel):
    match_id: int
    amount_cents: Optional[int] = 299

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    amount: int
    currency: str

class PaymentConfirm(BaseModel):
    payment_intent_id: str

class PaymentMethodsResponse(BaseModel):
    payment_methods: list[str]
    supported_currencies: list[str]
    chat_unlock_price: Dict[str, Any]

class WebhookEvent(BaseModel):
    type: str
    data: Dict[str, Any]
