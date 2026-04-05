export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  USER_NOT_FOUND: 'User not found',
};

export const USER_ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PHONE_ALREADY_EXISTS: 'Phone number already exists',
  USER_ALREADY_EXISTS: 'An account with this phone/email already exists',
  INVALID_USER_ID: 'Invalid user ID',
  USER_CREATION_FAILED: 'Failed to create user',
};

export const PROPERTY_ERROR_MESSAGE = {
  NOT_FOUND: 'Property not found.',
  INVALID_ID: 'Invalid property id',
};

export const RENTER_ERROR_MESSAGE = {
  NOT_FOUND: 'Renter not found.',
  INVALID_ID: 'Invalid renter id',
};

export const BILL_ERROR_MESSAGE = {
  NOT_FOUND: 'Bill not found',
  UPDATE_PAID_BILL: "Update on payment bill can't be done",
  UPDATE_FINALIZED_BILL:
    "Update on finalized bill can't be done, you can only cancel",
  UPDATE_CANCELLED_BILL: "Update on cancel bill can't be done",
  UPDATE_DRAFT_BILL: 'Finalized bill can not be updated',
};
