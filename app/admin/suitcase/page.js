'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row ,Spinner, Card} from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import widget/custom components
import { HighlightCode }  from 'widgets';
import DataTable from 'react-data-table-component';
import {
	Briefcase,
    ListTask,
    People,
    Bullseye
} from 'react-bootstrap-icons';
// import react code data file
import {
    BorderSpinnerCode,
    SpinnersColorsCode,
    GrowingSpinnerCode,
    GrowColorsCode,
    AlignmentCode,
    PlacementCenterCode,
    PlacementLoadingCode,
    FloatsCode,
    TextAlignCode,
    SizeSpinnersCode,
    StyleCSSCode,
    ButtonsCode,
    Buttons2Code
} from 'data/code/SpinnersCode';

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, 
    TasksPerformance 
} from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useUser } from 'context/userContext'; 


const Home = () => {
    
    const router = useRouter()
    const { usuario,setUsuario } = useUser();
    const [general, setgeneral] = useState([]);
    useEffect(() => {
        const verificarSesion = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/get_session`, {
              credentials: 'include',
            });
    
            if (res.status === 401) {
              router.push('/authentication/sign-in');
              return;
            }
    
            const data = await res.json();
            if (!data.usuario) {
              router.push('/authentication/sign-in');
              return;
            }
    
            // Guardar el usuario en estado si lo necesitas en el componente
            setUsuario(data.usuario);
          } catch (err) {
            router.push('/authentication/sign-in');
          }
        };
    
        verificarSesion();
    }, [router]);


    useEffect(() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/flightss/report`, {
            credentials: 'include',
          })
            .then(res => res.json())
            .then(data => setgeneral(data))
            .catch(err => console.error('Error cargando nóminas:', err));
        }, []);
  
        
    
    if (!usuario) {
        return <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>; // o spinner
    }
    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">Maletas </h3>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <FlightsList/>
            </Container>
        </Fragment>
    )
}
export default Home;


const FlightsList = () => {
    const [flights, setFlights] = useState([]);
    const router = useRouter();
  
    useEffect(() => {
      // Reemplaza esta URL con tu API real
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/flights`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setFlights(data))
        .catch(err => console.error('Error cargando vuelos:', err));
    }, []);
  
    const handleViewDetails = (flightId) => {
      router.push(`/admin/suitcase/${flightId}`);
    };
  
    const columns = [
      { name: 'Avión', selector: row => row.plane	, sortable: true },
      {
        name: 'Origen',
        selector: row => `${row.origin_state}, ${row.origin_country}`,
        sortable: true,
      },
      {
        name: 'Destino',
        selector: row => `${row.destination_state}, ${row.destination_country}`,
        sortable: true,
      },
      {
        name: 'Salida',
        selector: row =>
          new Date(row.departure_datetime).toLocaleString('es-ES'),
      },
      {
        name: 'Llegada',
        selector: row =>
          new Date(row.arrival_datetime).toLocaleString('es-ES'),
      },
      {
        name: 'Acciones',
        cell: row => (
          <button
            onClick={() => handleViewDetails(row._id)}
            className="btn btn-sm btn-primary"
          >
            Asignar maletas
          </button>
        ),
      },
    ];
  
    return (
        <Card className="h-100">
            <Card.Body>
                <div className="container mt-4">
                    <h2 className="mb-4">Lista de Vuelos</h2>
                    <DataTable
                    columns={columns}
                    data={flights}
                    pagination
                    responsive
                    striped
                    highlightOnHover
                    noDataComponent="No hay vuelos disponibles."
                    />
                </div>
            </Card.Body>
        </Card>
      
    );
  };