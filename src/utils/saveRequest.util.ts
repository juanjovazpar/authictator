import { RequestDetails } from "../models";
import { FastifyRequestWithDetails } from "../interfaces";

export const saveRequestDetails = async (req: FastifyRequestWithDetails) => {
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
