'use client'
import React from "react";
import Link from 'next/link';
import { Card, Dropdown } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


const Charts = () => {
    const [data, setData] = useState({ completado: 0, retrasado: 0, cancelado: 0 });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/flightssss/status-summary`);
          const result = await res.json();
  
          const counts = { completado: 0, retrasado: 0, cancelado: 0 };
          result.forEach(({ status, count }) => {
            if (status === 'completado') counts.completado = count;
            if (status === 'retrasado') counts.retrasado = count;
            if (status === 'cancelado') counts.cancelado = count;
          });
  
          setData(counts);
        } catch (err) {
          console.error("Error loading status summary:", err);
        }
      };
  
      fetchData();
    }, []);
  
    const total = data.completado + data.retrasado + data.cancelado || 1;
  
    const perfomanceChartSeries = [
      (data.completado / total) * 100,
      (data.retrasado / total) * 100,
      (data.cancelado / total) * 100
    ];
  
    const perfomanceChartOptions = {
      dataLabels: { enabled: false },
      labels: ['Completado', 'Retrasado', 'Cancelado'],
      colors: ['#28a745', '#ffc107', '#dc3545'],
      plotOptions: {
        radialBar: {
          startAngle: -168,
          endAngle: -450,
          hollow: {
            size: '55%',
          },
          track: {
            background: 'transparent',
          },
          dataLabels: {
            show: false,
          }
        }
      },
      chart: { type: 'radialBar' },
      stroke: { lineCap: "round" },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { height: 300 } }
        },
        {
          breakpoint: 5000,
          options: { chart: { height: 320 } }
        }
      ]
    };
  
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <Link
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className="text-muted text-primary-hover"
      >
        {children}
      </Link>
    ));
  
    CustomToggle.displayName = 'CustomToggle';
  
    const ActionMenu = () => {
      return (
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <MoreVertical size="15px" className="text-muted" />
          </Dropdown.Toggle>
          <Dropdown.Menu align={'end'}>
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    };
  
    return (
      <Card className="h-100">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-0">Desempeño de vuelos</h4>
            </div>
            <ActionMenu />
          </div>
  
          <div className="mb-8">
            <Chart
              options={perfomanceChartOptions}
              series={perfomanceChartSeries}
              type="radialBar"
              width="100%"
            />
          </div>
  
          <div className="d-flex align-items-center justify-content-around">
            <div className="text-center">
              <i className="fe fe-check-circle text-success fs-3"></i>
              <h1 className="mt-3 mb-1 fw-bold">{Math.round(perfomanceChartSeries[0])}%</h1>
              <p>Completado</p>
            </div>
            <div className="text-center">
              <i className="fe fe-trending-up text-warning fs-3"></i>
              <h1 className="mt-3 mb-1 fw-bold">{Math.round(perfomanceChartSeries[1])}%</h1>
              <p>Retrasado</p>
            </div>
            <div className="text-center">
              <i className="fe fe-trending-down text-danger fs-3"></i>
              <h1 className="mt-3 mb-1 fw-bold">{Math.round(perfomanceChartSeries[2])}%</h1>
              <p>Cancelado</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

export default Charts