package com.resengkor.management.domain.user.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.resengkor.management.domain.user.entity.QUser;

public class UserCustomRepositoryImpl implements UserCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public UserCustomRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }

    QUser user = QUser.user;
}
