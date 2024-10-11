package com.resengkor.management.domain.user.service;


import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.UserRegisterRequest;
import com.resengkor.management.domain.user.entity.Role;

public interface UserService {

     UserDTO changeUserRole(Long upperUserId, Long lowerUserId, Role newRole);

//    List<User> getUsersByRegionAndRole(Long userId, Long regionId, Role role);
//
//    User loginByEmail(String email, String password);
}
