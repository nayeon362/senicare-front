import dayjs from "dayjs";

// function: YYMMDD 형태의 생년월일로 만 나이 구하기 함수 //
export const calculateAge = (birthString: string) => {
    const yearString = birthString.substring(0,2);
    const monthString = birthString.substring(2,4);
    const dayString = birthString.substring(4,6);

    const birth = dayjs(`19${yearString}-${monthString}-${dayString}`);
    const today = dayjs(); // 오늘에 대한 날짜를 알 수 있음

    let age = today.year() - birth.year();
    // 만나이구하기 : 오늘을 기준으로 생일보다 이전인지 확인하고 나이 계산
    if (today.isBefore(birth.add(age, 'year'))) age --;
    return age;
};