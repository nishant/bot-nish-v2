export class Helpers {
  static shuffle<T>(array: Array<T>): Array<T> {
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
  }
}
