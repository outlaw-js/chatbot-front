import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import showdown from "showdown";

function App() {
  const converter = new showdown.Converter();

  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset
      const maxHeight = window.innerHeight * 0.25;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  };

  useEffect(() => {
    handleInput(); // run once to set initial height
  }, []);

  const requestToAi = async (prompt: string) => {
    setPrompt("");
    setLoading(true);
    const data = JSON.stringify({
      query: prompt,
      variables: {},
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://llama4.liara.run/search-and-fix",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const html = converter.makeHtml(response.data.AiResponse);
        setResponse(html);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="max-md:w-full h-full ">
        {response.length > 0 && !loading && (
          <div
            className="mb-[154px]"
            style={{ direction: "rtl" }}
            dangerouslySetInnerHTML={{ __html: response }}
          ></div>
        )}
        {loading && (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="w-full bg-gray-300 h-24"></div>
            <div className="w-full bg-gray-300 h-24"></div>
            <div className="w-full bg-gray-300 h-24"></div>
            <div className="w-full bg-gray-300 h-24"></div>
          </div>
        )}
        <div className="w-full  fixed bottom-7 right-0 px-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onInput={handleInput}
            placeholder="سوال خود را از چت بات سردخانه بپرسید"
            className="w-full placeholder:text-center text-right bg-white min-h-8 max-h-[25dvh] rounded-lg overflow-y-auto border-2 border-black-600 resize-none leading-6 p-2 text-base"
          />
          <button
            className="w-full h-14 bg-blue-800 text-white rounded-lg cursor-pointer hover:bg-blue-950"
            onClick={() => requestToAi(prompt)}
          >
            ارسال
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
