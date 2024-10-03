package com.resengkor.management.domain.user.entity;

public enum Role {
    ROLE_GUEST("ROLE_GUEST"),
    ROLE_MANAGER("ROLE_MANAGER"),
    ROLE_DISTRIBUTOR("ROLE_DISTRIBUTOR"),
    ROLE_AGENCY("ROLE_AGENCY"),
    ROLE_CUSTOMER("ROLE_CUSTOMER");

    String role;

    Role(String role){
        this.role = role;
    }

    public String value(){
        return role;
    }
}
