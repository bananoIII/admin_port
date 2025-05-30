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
  People,
  PersonCircle,
  GenderAmbiguous,
  Clock
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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/workers/reports`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setgeneral(data))
        .catch(err => console.error('Error cargando nóminas:', err));
    }, []);

    
    const workersStats = [
      {
        id: 1,
        title: "Total de Trabajadores",
        value: general?.total_trabajadores ?? 'Cargando...',
        icon: <People size={18} />,
        statInfo: general?.total_trabajadores
          ? `<span class='text-dark me-2'>trabajadores</span>`
          : 'Cargando...'
      },
      {
        id: 2,
        title: "Edad Promedio",
        value: general?.edad_promedio ?? 'Cargando...',
        icon: <PersonCircle size={18} />,
        statInfo: general?.edad_promedio
          ? `<span class='text-dark me-2'> años</span>`
          : 'Cargando...'
      },
      {
        id: 3,
        title: "Distribución de Género",
        value: general?.distribucion_genero
          ? `M: ${general.distribucion_genero.male}, F: ${general.distribucion_genero.female}`
          : 'Cargando...',
        icon: <GenderAmbiguous size={18} />,
        statInfo: `<span class='text-dark me-2'> </span>`
      },
      {
        id: 4,
        title: "Horas de Trabajo Promedio",
        value: general?.horas_trabajo_promedio ?? 'Cargando...',
        icon: <Clock size={18} />,
        statInfo: general?.horas_trabajo_promedio
          ? `<span class='text-dark me-2'> hrs/día</span>`
          : 'Cargando...'
      }
    ];
    
    
    
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
                                    <h3 className="mb-0  text-white">Trabajadores </h3>
                                </div>
                                <div>
                                    <Link href="/admin/workers/assign" className="btn btn-white">Contratar</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {workersStats.map((item, index) => {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/workers`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setPlanes(data))
      .catch(err => console.error('Error cargando trabajadores:', err));
  }, []);

  const handleViewDetails = (workerId) => {
    router.push(`/admin/workers/${workerId}`);
  };

  const columns = [
    { name: 'Nombre', selector: row => `${row.firstName} ${row.lastName}`, sortable: true },
    { name: 'RFC', selector: row => row.rfc, sortable: true },
    { name: 'Correo', selector: row => row.contact?.email, sortable: true },
    { name: 'Teléfono', selector: row => row.contact?.phone, sortable: true },
    { name: 'Puesto', selector: row => row.jobInfo?.position, sortable: true },
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
      <h2 className="mb-4">Lista de trabajadores</h2>
      <DataTable
        columns={columns}
        data={planes}
        pagination
        responsive
        striped
        highlightOnHover
        noDataComponent="No hay tra disponibles."
      />
    </div>
  );
};
