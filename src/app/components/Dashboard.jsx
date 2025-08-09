//'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Box, Button, Typography, TextField, List, ListItem } from '@mui/material';
require('dotenv').config();

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function WeatherComponent() {
    const [city, setCity] = useState('Edmonton');
    const [prevData, setPrevData] = useState(null);
    const [url, setUrl] = useState(`https://api.openweathermap.org/data/2.5/weather?q=Edmonton&appid=${process.env.NEXT_PUBLIC_API_KEY} `);
    const { data, error } = useSWR(url, fetcher);
    const [population, setPopulation] = useState(null);
    const [popLoading, setPopLoading] = useState(false);
    const [popError, setPopError] = useState(null);

    useEffect(() => {
        if (!data || !data.name) return;
        setPopLoading(true);
        setPopError(null);
        axios.get(`https://api.api-ninjas.com/v1/city?name=${data.name}`, {
            headers: { 'X-Api-Key': '+jgxYx6QCzXr6K9jANOZgA==t8Lx9MLLRdZj5HiM' }
        })
        .then((res) => {
            if (res.data && res.data.length > 0) {
                setPopulation(res.data[0].population);
            } else {
                setPopulation('N/A');
            }
            setPopLoading(false);
        })
        .catch((err) => {
            setPopError('Error fetching population');
            setPopulation(null);
            setPopLoading(false);
        });
    }, [data]);

    const handleInputChange = (event) => {
        setPrevData(data);
        setCity(event.target.value);
    };
    const handleSubmit = () => {
        setUrl(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_API_KEY} `);
        setCity(''); // Clear the input field
    };
    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    padding: '30px',
                    margin: '0 auto',
                    alignItems: 'stretch',
                    textAlign: 'center',
                    bgcolor: 'secondary.main',
                    borderRadius: '20px',
                    display: 'flex',
                    gap: '70px',
                }}
            >
                <Box width='30%' textAlign='center'>
                    <Typography variant='h1'>
                        {data.name}{' '}
                    </Typography>
                    {/* Population Data Section under city name */}
                    <Typography variant='h6' sx={{ mt: 1 }}>Population:</Typography>
                    {popLoading ? (
                        <Typography variant='body1'>Loading population...</Typography>
                    ) : popError ? (
                        <Typography variant='body1' color='error'>{popError}</Typography>
                    ) : (
                        <Typography variant='h5'>{population ? population.toLocaleString() : 'N/A'}</Typography>
                    )}
                </Box>
                <Typography variant='h1'> {Math.round(data.main.temp - 273.15)}°C </Typography>
                <TextField label='Enter City Name' variant='outlined' onClick={() => setCity('')} value={city} onChange={handleInputChange} />
                <Button variant='contained' sx={{ height: '20%', size: 'large' }} onClick={handleSubmit}>
                    Submit
                </Button>
                {prevData && (
                    <Box width='30%'>
                        <Typography variant='h7'>Previous City:</Typography>
                        <Typography variant='h5'>{prevData.name}</Typography>
                        <Typography variant='h5' align='center'>
                            {' '}
                            {Math.round(prevData.main.temp - 273.15)}°C{' '}
                        </Typography>
                    </Box>
                )}
            </Box>

           <List
                sx={{
                    display: 'flex',
                    Align: 'center',
                    gap: '7%',
                    listStyle: 'none',
                    padding: 0.1,
                    margin: 'auto',
                    width: '100%',
                }}
            >
                <ListItem sx={{ justifyContent: 'center' }}>
                    <Typography variant='h5'>Conditions: {data.weather[0].description}</Typography>
                </ListItem>
                <ListItem sx={{ justifyContent: 'center' }}>
                    <Typography variant='h5'> Humidity: {data.main.humidity}</Typography>
                </ListItem>
                <ListItem sx={{ justifyContent: 'center' }}>
                    <Typography variant='h5'> Wind Speed: {data.wind.speed}</Typography>
                </ListItem>
            </List>
        </>
    );
}