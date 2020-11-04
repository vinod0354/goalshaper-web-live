export class Constants {
    /* Http Status Codes */
    public static HTTP_STATUS_OK: number = 200;
    public static HTTP_STATUS_NO_CONTENT: number = 204;
    public static HTTP_STATUS_PRECONDITION_FAILED: number = 412;
    public static HTTP_STATUS_NOT_MATCHED: number = 417;
    public static HTTP_STATUS_INVALID_INPUT: number = 422;
    public static HTTP_STATUS_INTERNAL_SERVER_ERROR:number = 500;

    /* Custom Messages */
    public static MSG_PLEASE_WAIT: string = 'Please wait';
    public static MSG_LOADING_DATA_FAILED: string = 'Loading data failed!. Please try later.';

    /* Change Password */
    public static MSG_CHANGE_PASSWORD: string = 'Change Password';
    public static MSG_CURRENT_PASSWORD: string = 'Current Password';
    public static MSG_CURRENT_PASSWORD_REQUIRED: string = 'Current password required';
    public static MSG_NEW_PASSWORD: string = 'New Password';
    public static MSG_NEW_PASSWORD_REQUIRED: string = 'New password required';
    public static MSG_CONFIRM_PASSWORD: string = 'Confirm Password';
    public static MSG_CONFIRM_PASSWORD_REQUIRED: string = 'Confirm password required';
    public static MSG_CONFIRM_PASSWORD_NOT_MATCHED: string = 'Confirm password not matched';


     /* Enterprise Modal */
     public static MSG_ENTERPRISE_INFORMATION: string = 'Enterprise Information';
     public static MSG_GENERAL_INFORMATION: string = 'General Info';
     


    /* Button Text */
    public static BTN_CLOSE = 'Close';
}
