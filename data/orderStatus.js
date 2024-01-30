// Uma enum é um tipo no qual declaramos um conjunto de valores constantes pré-definidos.

export const PREPARING = 1;
export const WAITING_FOR_DELIVERYMAN = 2;
export const OUT_FOR_DELIVERY = 3;
export const FINISHED = 4;

export const STORE_ALLOWED_STATUS = [PREPARING, WAITING_FOR_DELIVERYMAN];
export const DELIVERYMAN_ALLOWED_STATUS = [OUT_FOR_DELIVERY, FINISHED];
