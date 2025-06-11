import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = sessionStorage.getItem('search');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const hasResults =
    results &&
    ((results.products && results.products.length > 0) ||
      (results.admin && results.admin.length > 0) ||
      (results.users && results.users.length > 0));

  return (
    <div style={styles.searchPage}>
      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.resultsContainer}>
        {hasResults ? (
          <>
            <ResultSection
              title="Products"
              items={results.products || []}
              renderItem={(product) => (
                <div>
                  ID: {product.id_product} - Name: {product.name_product} (Admin: {product.username_admin})
                </div>
              )}
            />
            <ResultSection
              title="Administrators"
              items={results.admin || []}
              renderItem={(admin) => <div>Username: {admin.username_admin}</div>}
            />
            <ResultSection
              title="Users"
              items={results.users || []}
              renderItem={(user) => (
                <div>
                  ID: {user.id_user} - Name: {user.first_name_user} (Email: {user.email})
                </div>
              )}
            />
          </>
        ) : (
          <div style={styles.noInfo}>Không có thông tin cần tìm!</div>
        )}
      </div>
    </div>
  );
};

const ResultSection = ({ title, items, renderItem }) => (
  <div style={styles.resultSection}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <div style={styles.resultList}>
      {items.length === 0 ? (
        <p style={styles.noResults}>Không tìm thấy {title.toLowerCase()}</p>
      ) : (
        items.map((item, index) => (
          <div key={index} style={styles.resultItem}>
            {renderItem(item)}
          </div>
        ))
      )}
    </div>
  </div>
);

// Styles (CSS inline)
const styles = {
  searchPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '18px',
  },
  resultsContainer: {
    width: '100%',
    maxWidth: '800px',
  },
  resultSection: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    margin: '0 0 10px',
    fontSize: '22px',
    color: '#333',
  },
  resultList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  resultItem: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '3px',
    fontSize: '16px',
    color: '#333',
  },
  noResults: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: '16px',
  },
  noInfo: {
    fontSize: '18px',
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default SearchPage;