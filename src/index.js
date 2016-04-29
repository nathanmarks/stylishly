
export default function sayHello(name, title) {
  let greeting = 'Hello';

  if (title) {
    greeting = greeting.concat(` ${title}`);
  }

  if (name) {
    greeting = greeting.concat(` ${name}`);
  }

  return greeting;
}
