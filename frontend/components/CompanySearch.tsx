'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { getForetak } from '../lib/api/getForetak';
import styles from './CompanySearch.module.css';

interface CompanySearchProps {
  onCompanySelect?: (company: { orgnr: number; navn: string } | null) => void;
}

export const CompanySearch = ({ onCompanySelect }: CompanySearchProps) => {
  const [value, setValue] = useState('');
  const [allResults, setAllResults] = useState<{ orgnr: number; navn: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{ orgnr: number; navn: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const lastFirstTwoLetters = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const firstTwo = value.slice(0, 2).toUpperCase();
    
    if (firstTwo.length === 2 && firstTwo !== lastFirstTwoLetters.current) {
      lastFirstTwoLetters.current = firstTwo;
      setLoading(true);
      
      getForetak(firstTwo)
        .then((data) => {
          setAllResults(data);
          setLoading(false);
          setIsOpen(true);
          setSelectedIndex(-1);
        })
        .catch((error) => {
          console.error('Error fetching companies:', error);
          setAllResults([]);
          setLoading(false);
          setIsOpen(false);
        });
    } else if (firstTwo.length < 2) {
      setAllResults([]);
      setIsOpen(false);
      lastFirstTwoLetters.current = '';
    }
  }, [value]);

  useEffect(() => {
    if (allResults.length > 0 && value.trim()) {
      const matchingCompany = allResults.find(
        (company) => company.navn.toLowerCase() === value.toLowerCase().trim()
      );
      if (matchingCompany && !selectedCompany) {
        handleSelect(matchingCompany);
      }
    }
  }, [allResults, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredResults.length === 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
          handleSelect(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const filteredResults = useMemo(() => {
    if (value.length < 2) return [];
    
    const searchTerm = value.toLowerCase();
    return allResults.filter((company) =>
      company.navn.toLowerCase().includes(searchTerm)
    );
  }, [value, allResults]);

  const formatOrgnr = (orgnr: number): string => {
    return orgnr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleSelect = (company: { orgnr: number; navn: string }) => {
    setSelectedCompany(company);
    onCompanySelect?.(company);
    setValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
    setAllResults([]);
    lastFirstTwoLetters.current = '';
  };

  const handleBlur = () => {
    if (value.trim()) {
      const matchingCompany = allResults.find(
        (company) => company.navn.toLowerCase() === value.toLowerCase().trim()
      );
      if (matchingCompany) {
        handleSelect(matchingCompany);
      }
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <input
        id="company-search"
        type="text"
        className={styles.searchInput}
        placeholder="Navn på virksomhet"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSelectedIndex(-1);
          if (selectedCompany) {
            setSelectedCompany(null);
            onCompanySelect?.(null);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          if (filteredResults.length > 0) {
            setIsOpen(true);
          }
        }}
      />
      {loading && <div className={styles.loading}>Loading...</div>}
      {!loading && isOpen && filteredResults.length > 0 && (
        <ul ref={listRef} className={styles.results}>
          {filteredResults.map((company, index) => (
            <li
              key={company.orgnr}
              className={`${styles.resultItem} ${
                index === selectedIndex ? styles.selected : ''
              }`}
              onClick={() => handleSelect(company)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {company.navn}
            </li>
          ))}
        </ul>
      )}
      {selectedCompany && (
        <div className={styles.selectedMessage}>
          <div className={styles.selectedTitle}>Valgt foretak</div>
          <div className={styles.selectedDetail}>
            <span className={styles.selectedLabel}>Orgnr:</span> {formatOrgnr(selectedCompany.orgnr)}
          </div>
          <div className={styles.selectedDetail}>
            <span className={styles.selectedLabel}>Navn:</span> {selectedCompany.navn}
          </div>
        </div>
      )}
    </div>
  );
};

