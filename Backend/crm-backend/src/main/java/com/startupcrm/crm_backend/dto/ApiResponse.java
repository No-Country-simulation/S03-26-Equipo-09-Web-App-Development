package com.startupcrm.crm_backend.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String error;

    public ApiResponse(boolean success, T data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
    //helper
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }


}
