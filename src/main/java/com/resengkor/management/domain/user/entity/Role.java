package com.resengkor.management.domain.user.entity;

public enum Role {
    ROLE_GUEST("ROLE_GUEST", 1),
    ROLE_CUSTOMER("ROLE_CUSTOMER", 2),
    ROLE_AGENCY("ROLE_AGENCY", 3),
    ROLE_DISTRIBUTOR("ROLE_DISTRIBUTOR", 4),
    ROLE_MANAGER("ROLE_MANAGER", 5);

    private String role;
    private int rank;

    Role(String role, int rank) {
        this.role = role;
        this.rank = rank;
    }

    public String getRole() {
        return role;
    }

    public int getRank() {
        return rank;
    }
}
