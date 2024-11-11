package com.resengkor.management.global.util;

import java.util.Random;

public class TmpCodeUtil {
    public static String generateAlphanumericPassword() {
        Random random = new Random();
        StringBuffer key = new StringBuffer();

        for (int i = 0; i < 8; i++) { // 인증 코드 8자리
            int index = random.nextInt(3); // 0~2까지 랜덤, 랜덤값으로 switch문 실행

            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 97)); // 소문자
                case 1 -> key.append((char) (random.nextInt(26) + 65)); // 대문자
                case 2 -> key.append(random.nextInt(10)); // 숫자
            }
        }
        return key.toString();
    }

    public static String generateAlphanumericPasswordWithSpecialChars() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();
        String specialChars = "!@#$%^&*"; // 특수문자 리스트

        for (int i = 0; i < 7; i++) { // 앞의 7자리는 소문자, 대문자, 숫자로 구성
            int index = random.nextInt(3); // 0~2까지 랜덤

            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 97)); // 소문자
                case 1 -> key.append((char) (random.nextInt(26) + 65)); // 대문자
                case 2 -> key.append(random.nextInt(10)); // 숫자
            }
        }

        // 마지막 글자는 특수문자로 설정
        key.append(specialChars.charAt(random.nextInt(specialChars.length())));

        return key.toString();
    }

    public static String generateNumericCode() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 5; i++) { // 인증코드 5자리
            key.append((rnd.nextInt(10)));
        }
        return key.toString();
    }

}
