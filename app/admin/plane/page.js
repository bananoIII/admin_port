'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row ,Spinner} from 'react-bootstrap';

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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/planes/report-planes`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setgeneral(data))
        .catch(err => console.error('Error cargando nóminas:', err));
    }, []);

    const estados = ["activo", "en mantenimiento", "fuera de servicio"];

    const planesStats = estados.map((estado, index) => ({
      id: index + 1,
      title: `Aviones en estado ${estado}`,
      value: general?.cantidad_por_estado
        ? (general.cantidad_por_estado.find(e => e.estado === estado)?.cantidad ?? 0)
        : 'Cargando...',
      icon: <Briefcase size={18} />
    }));
    
    planesStats.push({
      id: 4,
      title: "Distribución Promedio de Asientos",
      value: general?.distribucion_asientos
        ? `Premium: ${general.distribucion_asientos.premium}`
        : 'Cargando...',
      icon: <ListTask size={18} />,
      statInfo: general?.distribucion_asientos
        ? `Normales: ${general.distribucion_asientos.normales}`
        : 'Cargando...'
    });
    
    
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
                                    <h3 className="mb-0  text-white">Aviones </h3>
                                </div>
                                <div>
                                    <Link href="/admin/flights/assign" className="btn btn-white">Avión nuevo</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {planesStats.map((item, index) => {
                        return (
                            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                                <StatRightTopIcon info={item} />
                            </Col>
                        )
                    })}
                </Row>
                <PlanesList/>
            </Container>
        </Fragment>
    )
}
export default Home;


const PlanesList = () => {
  const [planes, setPlanes] = useState([]);

  const router = useRouter()
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/get_planes`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setPlanes(data))
      .catch(err => console.error('Error cargando aviones:', err));
  }, []);

  const handleViewDetails = (flightId) => {
    router.push(`/admin/plane/${flightId}`);
  };

  const columns = [
    { name: 'Modelo', selector: row => row.modelo, sortable: true },
    { name: 'Número de Serie', selector: row => row.numero_serie, sortable: true },
    {
      name: 'Asientos',
      selector: row =>
        `Normales: ${row.asientos?.normales}, Premium: ${row.asientos?.premium}`,
      sortable: true,
    },
    { name: 'Peso Máx (kg)', selector: row => row.peso_maximo_kg, sortable: true },
    { name: 'Estado', selector: row => row.estado, sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <button
          onClick={() => handleViewDetails(row._id)}
          className="btn btn-sm btn-primary"
        >
          Ver detalles
        </button>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Aviones</h2>
      <DataTable
        columns={columns}
        data={planes}
        pagination
        responsive
        striped
        highlightOnHover
        noDataComponent="No hay aviones disponibles."
      />
    </div>
  );
};
