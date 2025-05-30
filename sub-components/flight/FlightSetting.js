// import node module libraries
'use client'
import { useRouter } from 'next/navigation';
import { Col, Row, Form, Card, Button, Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// import widget as custom components
import { FormSelect, DropFiles } from 'widgets';

// import hooks
import useMounted from 'hooks/useMounted';

const FlightSetting = () => {
  const hasMounted = useMounted();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const [countryOptions, setCountryOptions] = useState([]);
  const [originStates, setOriginStates] = useState([]);
  const [destinationStates, setDestinationStates] = useState([]);
  const [planeOptions , setPlaneOptions] = useState([]);
  const [pilotOptions, setPilotOptions] = useState([]);
  const [attendantOptions, setAttendantOptions] = useState([]);
  const [pricePerKm, setPricePerKm] = useState('');
  const [distance, setDistance] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [originIso2, setOriginIso2] = useState('');
  const [destinationIso2, setDestinationIso2] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [flightDurationMinutes, setFlightDurationMinutes] = useState(0);
  const [originState, setOriginState] = useState('');
  const [destinationState, setDestinationState] = useState('');
  useEffect(() => {
    const fetchPlanes = async () => {
      const response = await fetch(`${API_URL}/admin_v2/api/planes`);
      const data = await response.json();
      const formatted = data.map(p => ({ label: p.modelo + ' ' + p.numero_serie, value: p._id }));
      setPlaneOptions(formatted);
    };
    fetchPlanes();
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      const response = await fetch(`${API_URL}/admin_v2/flight/workers`);
      const data = await response.json();
      
      const pilots = data
        .filter(w => w.tipo === 'pilot')
        .map(w => ({ label: w.nombre, value: w._id }));
        
      const attendants = data
        .filter(w => w.tipo === 'flight attendant')
        .map(w => ({ label: w.nombre, value: w._id }));
  
      setPilotOptions(pilots);
      setAttendantOptions(attendants);
    };
    fetchWorkers();
  }, []);

  
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(`${API_URL}/api/countries`);
      const data = await response.json();
      const formatted = data.map(c => ({ label: c.name, value: c.iso2 }));
      setCountryOptions(formatted);
    };
    fetchCountries();
  }, []);

  const handleOriginCountryChange = async (e) => {
    const iso2 = e.target.value;
    setOriginIso2(iso2);
    if (iso2 && destinationIso2) {
      fetchDistance(iso2, destinationIso2);
  }
    const response = await fetch(`${API_URL}/api/get/states/${iso2}`);
    const data = await response.json();
    const formatted = data.length ? data.map(s => ({ label: s.name, value: s.name })) : [{ label: '---------', value: '' }];
    setOriginStates(formatted);
  };

  const handleDestinationCountryChange = async (e) => {
    const iso2 = e.target.value;
    setDestinationIso2(iso2);
    if (originIso2 && iso2) {
      fetchDistance(originIso2, iso2);
    }
    const response = await fetch(`${API_URL}/api/get/states/${iso2}`);
    const data = await response.json();
    const formatted = data.length ? data.map(s => ({ label: s.name, value: s.name })) : [{ label: '---------', value: '' }];
    setDestinationStates(formatted);
  };


  const fetchDistance = async (originIso2, destinationIso2) => {
    try {
      const response = await fetch(`${API_URL}/admin_v2/flight/price_time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originIso2, destinationIso2 })
      });
  
      const data = await response.json();
      if (data.distancia_km) {
        setDistance(data.distancia_km);
        if (pricePerKm) {
          setTotalPrice((data.distancia_km * pricePerKm).toFixed(2));
        }
      }
      if (data.tiempo_horas) {
        setFlightDurationMinutes(Math.round(data.tiempo_horas * 60)); // convierte horas a minutos
      }
    } catch (error) {
      console.error('Error al obtener distancia:', error);
    }
  };

  useEffect(() => {
    if (!departureDate || !departureTime || !flightDurationMinutes) return;
  
    const departureDateTime = dayjs(`${departureDate}T${departureTime}`);
  
    const arrivalDateTime = departureDateTime.add(flightDurationMinutes, 'minute');
  
    setArrivalDate(arrivalDateTime.format('YYYY-MM-DD'));
    setArrivalTime(arrivalDateTime.format('HH:mm'));
  }, [departureDate, departureTime, flightDurationMinutes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const statusValue = "previsto";
    const flightData = {
      plane_id: document.getElementById("plane").value,
      origin_country: document.getElementById("originCountry").value,
      origin_state: document.getElementById("originState").value,
      destination_country: document.getElementById("destinationCountry").value,
      destination_state: document.getElementById("destinationState").value,
      price_per_km: parseFloat(pricePerKm),
      distance: parseFloat(distance),
      total_price: parseFloat(totalPrice),
      departure_datetime: `${departureDate}T${departureTime}`,
      arrival_datetime: `${arrivalDate}T${arrivalTime}`,
      pilot1_id: document.getElementById("pilot1").value,
      pilot2_id: document.getElementById("pilot2").value,
      attendant1_id: document.getElementById("attendant1").value,
      attendant2_id: document.getElementById("attendant2").value,
      attendant3_id: document.getElementById("attendant3").value,
      status: statusValue 
    };

    try {
      const response = await fetch(`${API_URL}/admin_v2/flight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData)
      });
  
      if (response.ok) {

         // ✅ Limpiar todos los campos
    setPricePerKm('');
    setDistance('');
    setTotalPrice('');
    setOriginIso2('');
    setDestinationIso2('');
    setDepartureDate('');
    setDepartureTime('');
    setArrivalDate('');
    setArrivalTime('');
    setFlightDurationMinutes(0);
    setOriginState('');
    setDestinationState('');

    // Si también deseas limpiar las opciones seleccionables (si no son reutilizables)
    setOriginStates([]);
    setDestinationStates([]);
    setPlaneOptions([]);
    setPilotOptions([]);
    setAttendantOptions([]);
        router.push('/admin/flights');
      } else {
        const error = await response.json();
        console.error("Error al guardar:", error);
        alert("Error al guardar el vuelo");
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Error de red");
    }
  };


  return (
    <Row className="mb-8" onSubmit={handleSubmit}>
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card>
          {/* card body */}
          <Card.Body>
            <div className=" mb-6">
              <h4 className="mb-1">Configuración del vuelo</h4>
            </div>
            {/* col */}
            <div>
              {hasMounted && 
              <Form>
                {/* row */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="plane">Avión</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control as={FormSelect} placeholder="Select Plane" id="plane" options={planeOptions}  />
                  </Col>
                </Row>


                {/* Location */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="originCountry">Origen</Form.Label>
                  <Col md={4} xs={6}><Form.Control as={FormSelect} placeholder="Select Country" id="originCountry" options={countryOptions}  onChange={handleOriginCountryChange} /></Col>
                  <Col md={4} xs={6}><Form.Control as={FormSelect} placeholder="Select State" id="originState" options={originStates} value={originState} onChange={(e) => setOriginState(e.target.value)} /></Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="destinationCountry">Destino</Form.Label>
                  <Col md={4} xs={6}><Form.Control as={FormSelect} placeholder="Select Country" id="destinationCountry" options={countryOptions} onChange={handleDestinationCountryChange} /></Col>
                  <Col md={4} xs={6}><Form.Control as={FormSelect} placeholder="Select State" id="destinationState" options={destinationStates} value={destinationState} onChange={(e) => setDestinationState(e.target.value)}/></Col>
                </Row>

                
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="addressLine">Price</Form.Label>
                  <Col md={2} xs={2}>
                    <Form.Control type="number" placeholder="Precio por Km" id="pricePerKm" value={pricePerKm}
                        onChange={(e) => {
                          setPricePerKm(e.target.value);
                          if (distance) {
                            setTotalPrice((e.target.value * distance).toFixed(2));
                          }
                        }} required />
                  </Col>
                  <Col md={2} xs={2}>
                    <Form.Control type="number" placeholder="Distancia" id="distance" value={distance} readOnly />
                  </Col>
                  <Col md={2} xs={2}>
                    <Form.Control type="number" placeholder="Total" id="totalPrice" value={totalPrice} readOnly />
                  </Col>
                </Row>

                
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="departureDate">Día salida</Form.Label>
                  <Col md={4} xs={6}>
                    <Form.Control type="date" id="departureDate" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />
                  </Col>
                  <Col md={4} xs={6}>
                    <Form.Control type="time" id="departureTime" value={departureTime} onChange={e => setDepartureTime(e.target.value)} required />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="arrivalDate">Día llegada</Form.Label>
                  <Col md={4} xs={6}>
                    <Form.Control type="date" id="arrivalDate" value={arrivalDate} readOnly />
                  </Col>
                  <Col md={4} xs={6}>
                    <Form.Control type="time" id="arrivalTime" value={arrivalTime} readOnly />
                  </Col>
                </Row>



                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="pilot1">Piloto</Form.Label>
                  <Col md={8} xs={12}><Form.Control as={FormSelect} placeholder="Select Pilot" id="pilot1" options={pilotOptions} /></Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="pilot2">Piloto</Form.Label>
                  <Col md={8} xs={12}><Form.Control as={FormSelect} placeholder="Select Pilot" id="pilot2" options={pilotOptions} /></Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="attendant1">Azafata</Form.Label>
                  <Col md={8} xs={12}><Form.Control as={FormSelect} placeholder="Select Flight Attendant" id="attendant1" options={attendantOptions} /></Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="attendant2">Azafata</Form.Label>
                  <Col md={8} xs={12}><Form.Control as={FormSelect} placeholder="Select Flight Attendant" id="attendant2" options={attendantOptions} /></Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="attendant3">Azafata</Form.Label>
                  <Col md={8} xs={12}><Form.Control as={FormSelect} placeholder="Select Flight Attendant" id="attendant3" options={attendantOptions} /></Col>
                </Row>
                {/* Zip code */}
                <Row className="align-items-center">
                  <Form.Label className="col-sm-4" htmlFor="zipcode"></Form.Label>

                  <Col md={8} xs={12}>
                    
                  </Col>

                  <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                    <Button variant="success" type="submit">
                      Guardar cambios
                    </Button>
                  </Col>

                </Row>
              </Form>
              }
            </div>
          </Card.Body>
        </Card>

      </Col>
    </Row>
  )
}

function calcularPrecio(){

}

export default FlightSetting