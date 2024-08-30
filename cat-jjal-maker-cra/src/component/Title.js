// 만약 <Title> 이부분 </Title> 이부분에 적힌 내용은 props.children으로 가져올 수 있다.
const Title = (props) => {
  return <h1>{props.label}</h1>;
};

export default Title;
