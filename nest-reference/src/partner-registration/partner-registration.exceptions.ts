import { HttpException } from "@nestjs/common";

export class PartnerAlreadyRequestedRegistrationException extends HttpException {
    constructor() { super("Vous avez déjà soumis une demande d'enregistrement, merci de contacter le support si vous souhaitez plus d'information.", 409) }
}
