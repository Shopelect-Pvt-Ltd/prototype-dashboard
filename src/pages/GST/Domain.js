
// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for HTTP requests
import firebase from 'firebase/compat/app'; //v9
import { useNavigate } from 'react-router-dom';



const firebaseConfig = {
    apiKey: "AIzaSyD33JyUFjugVISjRu_yElDamtvR0-6tBlU",
    authDomain: "prototype-finkraft.firebaseapp.com",
    projectId: "prototype-finkraft",
    storageBucket: "prototype-finkraft.appspot.com",
    messagingSenderId: "283994867558",
    appId: "1:283994867558:web:d5038e6f45625e3c86eaa7",
    measurementId: "G-6J2FHW78VS"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const DomainData = () => {
    // Initialize states
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [fetchedData, setFetchedData] = useState([]);
    const navigate = useNavigate();

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/gstcreds');
                const data = response.data;
                setFetchedData(data); // Set the fetched data to the state variable
                const domainData = data.map(item => item.domain);
                const uniqueDomains = [...new Set(domainData)]; // Filter out duplicates
                setDomains(uniqueDomains);
                console.log('Data fetched successfully:', uniqueDomains);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Add axios as dependency to useEffect

    // Event handler for input change
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Event handler for radio button change
    const handleRadioChange = (event) => {
        setSelectedDomain(event.target.value);
        setInputValue(event.target.value);

        
    };

    

    // Event handler for saving to Firebase
    const handleSaveToFirebase = () => {
        const db = firebase.firestore();
        db.collection('Domain').doc(inputValue).set({
            // Add your data here if needed
        })
        .then(() => {
            console.log('Workspace saved to Firebase');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        })
        .catch(error => {
            console.error('Error saving to Firebase:', error);
        });
    };


    const handleNext = () => {
        const gstinDataForDomain = fetchedData.filter(item => item.domain === selectedDomain)
            .map(item => item.gstin);

        console.log('GSTIN data for domain', selectedDomain, ':', gstinDataForDomain);
        console.log('Next button clicked');
        // fetchGSTINData(); // Fetch GSTIN data for the selected domain
        navigate(`/gstin-data`, { state: { fetchedData :gstinDataForDomain } });
    };

    // Event handler for clicking on "Credentials" button
    const handleCredentialsClick = () => {
        if (selectedDomain) {
            navigate(`/GSTCrud`, { state: { selectedDomain: selectedDomain } });
        } else {
            console.error('No domain selected');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="dashboard-container" style={{ position: 'relative', width: '80%' }}>
                <h1 style={{ textAlign: 'center' }}>Domain List</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '20px', marginBottom: '10px' }}>Selected Workspace:</label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter value"
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={handleSaveToFirebase} style={{ marginRight: '10px' }}>Save To Firebase</button>
                    <button onClick={handleNext} style={{ marginRight: '10px' }}>Next</button>
                    <button onClick={handleCredentialsClick} style={{ marginRight: '10px' }}>Credentials</button>
                </div>
                <div style={{ marginBottom: '20px', marginTop: '50px' }}>
                    {domains && domains.length > 0 && domains.map(domain => (
                        <div key={domain}>
                            <input
                                type="radio"
                                id={domain}
                                name="domain"
                                value={domain}
                                checked={selectedDomain === domain}
                                onChange={handleRadioChange}
                                style={{ marginRight: '20px' }}
                            />
                            <label htmlFor={domain}>{domain}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DomainData;


