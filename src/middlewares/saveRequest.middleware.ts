import { RequestDetails } from '../models';
import { IFastifyRequestWithDetails } from '../interfaces';

export const saveRequestDetails = async (req: IFastifyRequestWithDetails) => {
    const requestDetails = req['requestDetails'];
    const endpointsToExclude = ['/'];

    if (req.raw.url && endpointsToExclude.includes(req.raw.url)) {
        console.log('Skipping request details for:', req.raw.url);
        return;
    }

    if (requestDetails) {
        try {
            const newRequestDetail = new RequestDetails(requestDetails);
            await newRequestDetail.save();
        } catch (error) {
            console.error('Error saving request details to DB:', error);
        }
    }
};
