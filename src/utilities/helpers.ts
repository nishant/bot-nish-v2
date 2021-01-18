export const shuffle = <T>(array: Array<T>): Array<T> => {
  const copy = [...array];
  let currentIndex = copy.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = copy[currentIndex];
    copy[currentIndex] = copy[randomIndex];
    copy[randomIndex] = temporaryValue;
  }
  return copy;
};

export const rng = (lowerBound: number, upperBound: number): number =>
  Math.floor(Math.random() * (upperBound + 1 - lowerBound) + lowerBound);

export const formatNumberStringWithCommas = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const fisrtNChars = (s: string, n: number) => {
  return s !== null ? s.substring(0, Math.min(s.length, n)) : 'N/A';
};

// string in format YYYY-MM-DD to Month Day, Year
export const dateFormatToReadable = (date: string): string => {
  if (date === 'N/A') return date;

  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(date)) {
    throw new Error('date must be in YYYY-MM-DD');
  }

  const spl = date.split('-');
  const yyyy = spl[0];
  const mm = spl[1];
  const dd = spl[2];
  let month: string;
  let day: string;

  // eslint-disable-next-line prefer-destructuring,no-unused-expressions
  dd[0] === '0' ? (day = dd[1]) : (day = dd);

  switch (mm) {
    case '01':
      month = 'January';
      break;
    case '02':
      month = 'February';
      break;
    case '03':
      month = 'March';
      break;
    case '04':
      month = 'April';
      break;
    case '05':
      month = 'May';
      break;
    case '06':
      month = 'June';
      break;
    case '07':
      month = 'July';
      break;
    case '08':
      month = 'August';
      break;
    case '09':
      month = 'September';
      break;
    case '10':
      month = 'October';
      break;
    case '11':
      month = 'November';
      break;
    case '12':
      month = 'December';
      break;
    default:
      month = 'N/A';
  }

  return `${month} ${day}, ${yyyy}`;
};
