package com.resengkor.management.domain.user.entity;

public enum Role {
    ROLE_PENDING("ROLE_PENDING", 0), // 추가 정보 입력 대기 상태(OAuth로 가입)
    ROLE_GUEST("ROLE_GUEST", 1), //일반 회원으로 가입된 일단 대기 상태(근데 정보는 다 있음)
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