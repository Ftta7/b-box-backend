export function SuccessResponse(data: any, message = 'OK') {
    return {
      success: true,
      message,
      data: data ?? null,
    };
  }
  
  export function ErrorsResponse(data: any,message = 'Something went wrong') {
    return {
      success: false,
      message,
      data: data ?? null,
    };
  }