import React from "react";
import "./App.css";
import Title from "./component/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/cat/${responseJson._id}/says/${text}`;
};
function CatItem(props) {
  // react에서 컴포넌트로 들어온 모든 값은 props가 받음
  // props.속성을 하게되면 해당 태그로부터 들어온 속성 값을 참조할 수 있음
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorties(props) {
  const cats = props.favorites;

  if (cats.length === 0) {
    return <div> 사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {cats.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

// ES6+ 디스트럭처링 문 법 적용하면 {img} 형태로 오브젝트 그대로 받아와서 해결 할 수 있음
const MainCard = (props) => {
  const heartIcon = props.alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={props.img} alt="고양이" width="400" />
      <button onClick={props.onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const FormTag = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    if (includesHangul(userInput)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("");
    }
    setValue(userInput);
  };

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로는 만들 수 없습니다.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        onChange={handleInputChange}
        value={value}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(mainCat);

  const setInitialCat = async () => {
    const newCat = await fetchCat("First Cat");
    console.log(newCat);
    setMainCat(newCat);
  };

  React.useEffect(() => {
    setInitialCat();
  }, []);

  const updateMainCat = async (value) => {
    const newCat = await fetchCat(value);
    setMainCat(newCat);
    //해당 함수형으로 했을때 예를 들어 빠르게 n번클릭 했을때 바로 반응이 되지 않거나 지연이 발생할 수 있는 가능성을 없애준다.
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return prev + 1;
    });
  };

  const handleHeartClick = () => {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  };

  let titleLabel;
  if (counter === null) {
    titleLabel = "고양이 가라사대 리액트";
  } else {
    titleLabel = String(counter) + "번째 고양이 가라사대 리액트";
  }

  return (
    <div>
      <Title label={titleLabel} />
      <FormTag updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorties favorites={favorites} />
    </div>
  );
};

export default App;
