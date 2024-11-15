// 비밀번호 유효성 검사
export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

// 비밀번호 일치 여부 검사
export const checkPasswordMatch = (password, confirmPassword) => {
  return password && confirmPassword && password === confirmPassword;
};
