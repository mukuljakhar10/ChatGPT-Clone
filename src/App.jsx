import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import OptionSelection from "./components/OptionSelection";
import Translation from "./components/Translation";
import { arrayItems } from "./AIOptions";
import { useState } from "react";

function App() {
  const openAIKey=import.meta.env.VITE_OPEN_AI_KEY
  const configuration = new Configuration({
    apiKey:openAIKey,
  });
  const openai = new OpenAIApi(configuration);
  const [option, setOption] = useState({});
  const [result, setResult] = useState("");
  const [input, setInput] = useState("");
  const selectOption = (option) => {
    setOption(option);
  };

  const doStuff = async () => {
    let object = { ...option, prompt: input };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(openAIKey)
      },
      body: JSON.stringify({
        'prompt': object.prompt,
        'temperature': object.temperature,
        'max_tokens': object.max_tokens,
        'top_p': object.top_p,
        'frequency_penalty': object.frequency_penalty,
        'presence_penalty': object.presence_penalty,
        'stop': ["\"\"\""],
      })
    };
    fetch(`https://api.openai.com/v1/engines/${object.model}/completions`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setResult(data.choices[0].text);
      }).catch(err => {
        console.log("Ran out of tokens for today! Try tomorrow!");
      });

    // const response = await openai.createCompletion(object);
    // console.log(response)
    // setResult(response.data.choices[0].text);
  };

  return (
    <div className="App">
      {Object.values(option).length === 0 ? (
        <OptionSelection arrayItems={arrayItems} selectOption={selectOption} />
      ) : (
        <Translation doStuff={doStuff} setInput={setInput} result={result} />
      )}
    </div>
  );
}

export default App;