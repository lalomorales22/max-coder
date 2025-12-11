import { CodeSnippet } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 2000];

export const INITIAL_USER_STATE = {
  id: 'cadet-1',
  username: 'Cadet Zero',
  xp: 0,
  stars: 0,
  level: 1
};

export const CODING_LANGUAGES = [
  'Python', 'JavaScript', 'Java', 'C++', 'Rust', 'Go', 'Kotlin', 'Swift', 'C'
];

export const TYPING_CHALLENGES: Record<string, CodeSnippet> = {
  'Python': {
    id: 'py-1',
    language: 'Python',
    difficulty: 'medium',
    code: `def calculate_area(radius):
    pi = 3.14159
    area = pi * (radius ** 2)
    return area`
  },
  'JavaScript': {
    id: 'js-1',
    language: 'JavaScript',
    difficulty: 'medium',
    code: `function createSpaceship(name) {
  return {
    type: "Rocket",
    fuel: 100,
    launch: () => console.log("Blast off!")
  };
}`
  },
  'Java': {
    id: 'java-1',
    language: 'Java',
    difficulty: 'hard',
    code: `public class Hero {
    public static void main(String[] args) {
        System.out.println("Hero spawned!");
    }
}`
  },
  'C++': {
    id: 'cpp-1',
    language: 'C++',
    difficulty: 'hard',
    code: `int main() {
    int score = 100;
    if (score > 50) {
        cout << "You win!";
    }
    return 0;
}`
  },
  'Rust': {
    id: 'rust-1',
    language: 'Rust',
    difficulty: 'hard',
    code: `fn main() {
    let mut fuel = 50;
    while fuel > 0 {
        println!("Flying...");
        fuel -= 1;
    }
}`
  },
  'Go': {
    id: 'go-1',
    language: 'Go',
    difficulty: 'medium',
    code: `func main() {
    messages := make(chan string)
    go func() { messages <- "ping" }()
    msg := <-messages
    fmt.Println(msg)
}`
  },
  'Kotlin': {
    id: 'kt-1',
    language: 'Kotlin',
    difficulty: 'medium',
    code: `fun main() {
    val planets = listOf("Mars", "Venus")
    for (planet in planets) {
        println("Hello $planet")
    }
}`
  },
  'Swift': {
    id: 'swift-1',
    language: 'Swift',
    difficulty: 'medium',
    code: `func greet(person: String) -> String {
    let greeting = "Hello, " + person + "!"
    return greeting
}`
  },
  'C': {
    id: 'c-1',
    language: 'C',
    difficulty: 'hard',
    code: `int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`
  }
};