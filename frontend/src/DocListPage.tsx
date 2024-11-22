import React from "react";

export default () => {
  const [docList, setDocList] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetch("/api/documents")
      .then((response) => response.json())
      .then((data) => {
        setDocList(data);
      });
  },[]);
  return (
    <div>
      <h1>Document List</h1>
      <button
      onClick={()=>{
        setDocList([...docList,`doc-${Date.now()}.txt`]);
      }}
      >New Document</button>
      <ul>
        {docList.map((doc) => (
          <li key={doc}>
            <a href={`/doc/${doc}`}>{doc}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
