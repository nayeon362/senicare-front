import { ChargedCustomer } from "src/types";
import ResponseDto from "../response.dto";

// interface: get charged customer response body dto //
export default interface getChargedCustomerRequestDto extends ResponseDto {
    customers: ChargedCustomer[];
}