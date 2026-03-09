// Report Generation Module for FermerX
// Aggregates data from all modules for comprehensive reporting

import { getAllByUserId } from './operations';
import { calculateExpectedYield, calculateYieldPerHectare } from './yieldPrediction';

/**
 * Filter items by date range
 * @param {Array} items - Items with date property
 * @param {number} days - Number of days to go back
 * @returns {Array} Filtered items
 */
export const filterByDateRange = (items, days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return items.filter(item => {
        const itemDate = new Date(item.date || item.plantDate);
        return itemDate >= startDate && itemDate <= endDate;
    });
};

/**
 * Calculate summary statistics from report data
 * @param {Object} data - Report data object
 * @returns {Object} Summary statistics
 */
export const calculateSummaryStats = (data) => {
    const totalExpenses = data.expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    const totalIncome = data.income.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;

    // Calculate warehouse revenue
    const warehouseRevenue = data.warehouseHistory
        .filter(h => h.type === 'sale')
        .reduce((sum, h) => sum + (parseFloat(h.totalPrice) || 0), 0);

    // Calculate total expected yield
    const totalExpectedYield = data.crops.reduce((sum, crop) => {
        return sum + (parseFloat(crop.expectedYield) || 0);
    }, 0);

    // Calculate average yield per hectare
    const totalArea = data.crops.reduce((sum, crop) => sum + (parseFloat(crop.area) || 0), 0);
    const avgYieldPerHectare = totalArea > 0 ? totalExpectedYield / totalArea : 0;

    // Count warehouse operations
    const warehouseSales = data.warehouseHistory.filter(h => h.type === 'sale').length;
    const warehouseUsage = data.warehouseHistory.filter(h => h.type === 'use').length;

    return {
        totalExpenses,
        totalIncome,
        balance,
        warehouseRevenue,
        totalExpectedYield,
        avgYieldPerHectare,
        activeCrops: data.crops.length,
        totalLand: data.land.reduce((sum, l) => sum + (parseFloat(l.totalArea) || 0), 0),
        usedLand: totalArea,
        availableLand: data.land.reduce((sum, l) => sum + (parseFloat(l.totalArea) || 0), 0) - totalArea,
        warehouseItemCount: data.warehouse.filter(w => w.quantity > 0).length,
        warehouseSales,
        warehouseUsage,
        expensesByType: groupExpensesByType(data.expenses),
        incomeBySource: groupIncomeBySource(data.income),
        cropsByType: groupCropsByType(data.crops)
    };
};

/**
 * Group expenses by type
 */
const groupExpensesByType = (expenses) => {
    const grouped = {};
    expenses.forEach(exp => {
        const type = exp.type || 'finance.categories.other';
        grouped[type] = (grouped[type] || 0) + parseFloat(exp.amount || 0);
    });
    return grouped;
};

/**
 * Group income by source
 */
const groupIncomeBySource = (income) => {
    const grouped = {};
    income.forEach(inc => {
        const source = inc.source || 'finance.categories.other';
        grouped[source] = (grouped[source] || 0) + parseFloat(inc.amount || 0);
    });
    return grouped;
};

/**
 * Group crops by type
 */
const groupCropsByType = (crops) => {
    const grouped = {};
    crops.forEach(crop => {
        const type = crop.type || 'finance.categories.other';
        if (!grouped[type]) {
            grouped[type] = { count: 0, area: 0, expectedYield: 0 };
        }
        grouped[type].count++;
        grouped[type].area += parseFloat(crop.area || 0);
        grouped[type].expectedYield += parseFloat(crop.expectedYield || 0);
    });
    return grouped;
};

/**
 * Generate monthly report (last 30 days)
 * @param {number} userId - User ID
 * @returns {Object} Report data
 */
export const generateMonthlyReport = async (userId) => {
    return await generateReport(userId, 30, 'monthly');
};

/**
 * Generate yearly report (last 365 days)
 * @param {number} userId - User ID
 * @returns {Object} Report data
 */
export const generateYearlyReport = async (userId) => {
    return await generateReport(userId, 365, 'yearly');
};

/**
 * Generate report for specified time period
 * @param {number} userId - User ID
 * @param {number} days - Number of days to include
 * @param {string} type - Report type ('monthly' or 'yearly')
 * @returns {Object} Complete report data
 */
const generateReport = async (userId, days, type) => {
    try {
        // Fetch all data
        const [land, crops, expenses, income, warehouse, warehouseHistory] = await Promise.all([
            getAllByUserId('land', userId),
            getAllByUserId('crops', userId),
            getAllByUserId('expenses', userId),
            getAllByUserId('income', userId),
            getAllByUserId('warehouse', userId),
            getAllByUserId('warehouseHistory', userId)
        ]);

        // harvestedCrops va soldItems ni alohida yuklash
        let harvestedCrops = [], soldItems = [];
        try {
            const { getDB } = await import('./database');
            const db = await getDB();
            harvestedCrops = await db.getAllFromIndex('harvestedCrops', 'userId', userId);
            soldItems = await db.getAllFromIndex('soldItems', 'userId', userId);
        } catch (e) { console.warn('Could not load harvestedCrops/soldItems:', e); }

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Filter data by date range
        const filteredExpenses = filterByDateRange(expenses, days);
        const filteredIncome = filterByDateRange(income, days);
        const filteredWarehouseHistory = filterByDateRange(warehouseHistory, days);
        const filteredCrops = filterByDateRange(crops, days);

        // Enhance crops with yield predictions
        const enhancedCrops = filteredCrops.map(crop => {
            const expectedYield = calculateExpectedYield(crop);
            const yieldPerHectare = calculateYieldPerHectare(crop);

            // Calculate crop-specific expenses
            const cropExpenses = filteredExpenses
                .filter(exp => exp.cropName === crop.name)
                .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

            return {
                ...crop,
                expectedYield,
                yieldPerHectare,
                cropExpenses
            };
        });

        // Enhance warehouse history with item names
        const enhancedWarehouseHistory = filteredWarehouseHistory.map(history => {
            const item = warehouse.find(w => w.id === history.itemId);
            return {
                ...history,
                itemName: item?.name || 'common.noData',
                itemCategory: item?.category || 'finance.categories.other'
            };
        });

        const reportData = {
            period: {
                start: startDate,
                end: endDate,
                type,
                days
            },
            land,
            crops: enhancedCrops,
            expenses: filteredExpenses,
            income: filteredIncome,
            warehouse,
            warehouseHistory: enhancedWarehouseHistory,
            harvestedCrops: harvestedCrops,
            soldItems: soldItems
        };

        // Calculate summary
        const summary = calculateSummaryStats(reportData);

        return {
            ...reportData,
            summary,
            generatedAt: new Date()
        };
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
};

/**
 * Get top expenses
 * @param {Array} expenses - Expenses array
 * @param {number} limit - Number of top items
 * @returns {Array} Top expenses
 */
export const getTopExpenses = (expenses, limit = 5) => {
    return [...expenses]
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, limit);
};

/**
 * Get top income sources
 * @param {Array} income - Income array
 * @param {number} limit - Number of top items
 * @returns {Array} Top income sources
 */
export const getTopIncome = (income, limit = 5) => {
    return [...income]
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, limit);
};

/**
 * Calculate ROI (Return on Investment) for crops
 * @param {Object} crop - Crop with expenses and expected yield
 * @param {number} marketPrice - Price per ton (optional)
 * @returns {number} ROI percentage
 */
export const calculateCropROI = (crop, marketPrice = 0) => {
    const expenses = parseFloat(crop.cropExpenses || 0);
    if (expenses === 0) return 0;

    const expectedRevenue = marketPrice > 0
        ? parseFloat(crop.expectedYield || 0) * marketPrice
        : 0;

    if (expectedRevenue === 0) return 0;

    return ((expectedRevenue - expenses) / expenses) * 100;
};
