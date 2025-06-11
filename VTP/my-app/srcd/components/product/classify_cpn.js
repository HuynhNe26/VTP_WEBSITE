import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../css/classify.css';

function Classify_cpn() {
    const { selectedCategory } = useParams();
    const [classify, setClassify] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState('');

    useEffect(() => {
        const fetchClassify = async () => {
            try {
                const response = await fetch(`http://localhost:5000/category/${selectedCategory}`);
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setCategoryImage(data[0].image_category);
                    setCategoryName(data[0].name_category);
                    setClassify(data);
                } else {
                    setClassify([]);
                }
            } catch (error) {
                console.error("Error fetching classify data:", error);
                setClassify([]);
            }
        };
        fetchClassify();
    }, [selectedCategory]);

    return (
        <div className="classify">
            <div className="classify__a">
                <div className="frame">
                    <div className="category">
                        {categoryImage && <img className="category_image" src={categoryImage} alt={categoryName} />}
                        {categoryName && <h5 className="description">{categoryName}</h5>}
                    </div>
                </div>
                <div className="button-group">
                    {classify.length === 0 && <p>No classify found for this category.</p>}
                    {classify.map(classify => (
                        <Link
                            className="button"
                            to={`/category/${selectedCategory}/classify/${classify.id_classify}/product`}
                            key={classify.id_classify}
                        >
                            <p>{classify.name_classify}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Classify_cpn;