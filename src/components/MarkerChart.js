import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';



const MarkerChartFunction = require("../functions/MarkerChartFunction");
function getPageColumn(result_months, result_dates, theme) {
    let columns = [];
    columns.push(
        {
            headerName: (
                <Box
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {"Name Of Employees"}
                    </Typography>

                </Box>
            ),
            field: "name",
            renderCell: (row) => (
                <Box
                    sx={{
                        width: '70%',
                        height: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5px',
                    }}
                >
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {row.row.name}
                    </Typography>
                </Box>
            ),
            width: 250
        }
    );
    for (let i = 0; i < result_months.length; i++) {
        columns.push(
            {
                headerName: (
                    <Box
                        sx={{
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                            {result_months[i]}
                        </Typography>

                    </Box>
                ),
                field: result_months[i],
                renderCell: (row) => (
                    <Box
                        sx={{
                            width: '70%',
                            height: '70%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '5px',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                            {row.row[result_months[i]]}
                        </Typography>
                    </Box>
                ),
                width: 150
            }
        );
    }
    for (let i = 0; i < result_dates.length; i++) {
        columns.push(
            {
                headerName: (
                    <Box
                        sx={{
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                            {result_dates[i]}
                        </Typography>

                    </Box>
                ),
                field: result_dates[i],
                renderCell: (row) => (
                    <Box
                        sx={{
                            backgroundColor: row.row[result_dates[i]] > 5 ? 'red' : 'green',
                            width: '70%',
                            height: '70%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '5px',
                        }}
                    >
                        <Typography variant="body1" color="white" fontWeight="bold">
                            {row.row[result_dates[i]] > 5 ? 'Absent' : 'Present'}
                        </Typography>
                    </Box>
                ),
                width: 150
            }
        );
    }
    return columns;
}

function getGroupedColumn(result_months, result_dates, theme) {
    let pastSixMonths = [];
    let presentMonth = [];
    for (let i = 0; i < result_months.length; i++) {
        pastSixMonths.push({ field: result_months[i] });
    }
    for (let i = 0; i < result_dates.length; i++) {
        presentMonth.push({ field: result_dates[i] });
    }
    let columnGroupingModel = [
        // {
        //     headerName: (
        //         <Box sx={{ width: "610px", textAlign: "center" }}>
        //             {"Names"}
        //         </Box>
        //     ),
        //     groupId: "names",
        //     children: [{ field: "name" }],
        // },
        {
            headerName: (
                <Box sx={{ width: "610px", textAlign: "center" }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {"Last 6 Months"}
                    </Typography>
                </Box>
            ),
            groupId: "months",
            children: pastSixMonths,
        },
        {
            headerName: (
                <Box sx={{ width: "610px" }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {MarkerChartFunction.currentMonth}
                    </Typography>
                </Box>
            ),
            groupId: "daily",
            children: presentMonth,
        },
    ];
    return columnGroupingModel;
}


export default function MarkerChart() {
    const theme = useTheme();
    let result_months = MarkerChartFunction.getPastSixMonths() || [];
    let result_dates = MarkerChartFunction.getDatesFromStartOfMonth() || [];
    let result_name = MarkerChartFunction.randomNames || [];
    let rows = MarkerChartFunction.RowGenerator(result_name) || [];
    let columns = getPageColumn(result_months, result_dates, theme) || [];
    let columnGroupingModel = getGroupedColumn(result_months, result_dates, theme) || [];

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ lineHeight: '2', color: theme.palette.text.primary }}>
                    Marker Chart {"\n"}
                </Typography>
                <DataGrid
                    experimentalFeatures={{ columnGrouping: true }}
                    pageSize={10}
                    filterable={true}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    rows={rows.map((data, index) => ({
                        ...data,
                        id: index
                    })) || []}
                    columns={columns}
                    columnGroupingModel={columnGroupingModel}
                />
            </CardContent>
        </Card>
    );
}