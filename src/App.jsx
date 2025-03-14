import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 800px;
  height: 600px;
  border: 3px solid black;
  padding: 1rem;
  overflow-y: auto;
`;

const BotMessage = styled.p`
  text-align: left;
  padding: 1rem;
  background-color: #c6e5ef;
`;
const UserMessage = styled.p`
  text-align: right;
  padding: 1rem;
  background-color: #f2d9d9;
`;

const Form = styled.form`
  margin-top: 1rem;
`;

const Input = styled.input`
  width: 700px;
  height: 2rem;
  padding: 0.5rem;
`;

const Button = styled.button`
  height: 2rem;
  padding: 0.5rem;
  border: 1px solid gray;
  cursor: pointer;
  margin-left: 1rem;
`;

function WebSocketComponent() {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/chat");

    ws.onopen = () => console.log("웹 소켓 연결 성공");
    ws.onmessage = (event) => {
      setHistory((prev) => [...prev, { type: "bot", msg: event.data }]);
    };
    ws.onclose = () => console.log("웹 소켓 연결 종료");
    ws.onerror = (error) => console.error("웹 소켓 오류:", error);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && input) {
      socket.send(input);
      setInput("");
      setHistory((prev) => [...prev, { type: "user", msg: input }]);
    }
  };

  return (
    <div>
      <h2>웹 소켓 채팅</h2>
      <Container ref={containerRef}>
        {history.map((msg, index) =>
          msg.type === "bot" ? (
            <BotMessage key={index}>{msg.msg}</BotMessage>
          ) : (
            <UserMessage key={index}>{msg.msg}</UserMessage>
          )
        )}
      </Container>
      <Form onSubmit={sendMessage}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <Button type="submit">전송</Button>
      </Form>
    </div>
  );
}

export default WebSocketComponent;
