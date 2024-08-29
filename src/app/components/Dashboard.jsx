//'use client';
import React, { useState } from 'react';
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
                <Typography variant='h1' width='30%'>
                    {data.name}{' '}
                </Typography>
                <Typography variant='h1'> {Math.round(data.main.temp - 273.15)}°C </Typography>
                <TextField label='Enter City Name' variant='outlined' value={city} onChange={handleInputChange} />
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