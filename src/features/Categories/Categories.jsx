import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Category from "./Category";

const categories = ["Electronics", "Fashion", "Accessories", "Phone Models"];

function Categories() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");

  const [activeTab, setActiveTab] = useState(cat || categories[0]);

  useEffect(() => {
    if (cat && categories.includes(cat)) {
      setActiveTab(cat);
    }
  }, [cat]);

  return (
    <div>
      <h1>Categories</h1>

      <div>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveTab(c)}
            style={{ marginRight: "10px" }}
          >
            {c}
          </button>
        ))}
      </div>

      <Category categoryName={activeTab} />
    </div>
  );
}

export default Categories;
