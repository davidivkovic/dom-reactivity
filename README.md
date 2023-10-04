# dom-reactivity - a Fine Grained Reactivity JavaScript Framework

dom-reactivity is a JavaScript framework designed to provide fine-grained reactivity without the need for a virtual DOM (VDOM). It achieves this by leveraging signals and effects, allowing you to create efficient and responsive web applications. This framework is ideal for those who want to optimize performance while building complex user interfaces.

## Features

- Fine-grained reactivity: Track changes at a granular level for efficient updates.
- No virtual DOM: Avoid the overhead of a vDOM while maintaining reactivity.
- Signals and effects: Use signals to track dependencies and effects to trigger updates.
- Easy setup: Clone the template and start building your application quickly.

## Getting Started

Follow these steps to create a new project using dom-reactivity:

1. Clone the template repository using [degit](https://github.com/Rich-Harris/degit):

   ```bash
   npx degit davidivkovic/dom-reactivity/templates/vite my-app-name
   ```

   Replace `my-app-name` with the desired name for your project.

2. Navigate to your project directory:

   ```bash
   cd my-app-name
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

This will launch your dom-reactivity application, and you can access it in your browser at `http://localhost:5173`.

## Project Structure

- `src/main.js`: The entry point of your application.
- `src/App.jsx`: Contains a basic demonstration of components, signals, and effects.

You can modify and expand upon these files to build your application.

## Example Usage

Here's a basic example of how to use dom-reactivity in your application:

```javascript
import { signal, effect, render } from 'dom-reactivity'

// Create a signal to track a reactive value
const count = signal(0)

// Create an effect to react to changes in count
effect(() => console.log(`Count changed: ${count()}`))

// Create a reactive derivation
const doubleCount = () => count() * 2

// Create an effect to react to changes in doubleCount
effect(() => console.log(`Double Count changed: ${doubleCount()}`))

// Update count
count(1) // This will trigger the effect

// Create a component using JSX
function Greeting(props) {
  return (
    <div onClick={props.onClick} style={{ 'cursor': 'pointer' }}>
      Hello, {props.name}. Your count is {props.count}
    </div>
  )
}

// Render it in the document
render(() => 
  <Greeting 
    name="John" 
    count={count()} 
    onClick={() => count(c => c + 1)} 
  />, 
  document.getElementById('app')
)
```

This code snippet demonstrates the basic usage of signals and effects in dom-reactivity. You can use these building blocks to create reactive components and manage your application's state.

## Contributing

If you'd like to contribute to dom-reactivity, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

dom-reactivity is inspired by the principles of fine-grained reactivity and is built upon the hard work of the open-source community. I am are grateful for their contributions.

---

Happy coding with dom-reactivity! If you have any questions or encounter any issues, please feel free to reach out to me or open an issue on the [GitHub repository](https://github.com/davidivkovic/dom-reactivity).