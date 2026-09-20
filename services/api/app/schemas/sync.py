from pydantic import BaseModel, Field
from typing import Optional

class EncryptedSyncPayload(BaseModel):
    user_id: str
    ciphertext_blob: str = Field(..., description="Client-side AES-256-GCM encrypted payload")
    nonce: str = Field(..., description="Cryptographic initialization vector")
    tag: str = Field(..., description="Authentication tag")
    data_version: str = "1.0.0"
    created_at: int

class SyncResponse(BaseModel):
    status: str
    synced_at: int
    data_version: str

class AccountDeletionRequest(BaseModel):
    user_id: str
    confirmation: bool = True
