import User from '../models/User.js';
import Market from '../models/Market.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, fail } from '../utils/response.js';

export const dashboard = asyncHandler(async (req, res) => {
  const [totalFarmers, totalCustomers, totalMarkets, totalOrders] = await Promise.all([
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'customer' }),
    Market.countDocuments(),
    Order.countDocuments(),
  ]);
  return ok(res, { totalFarmers, totalCustomers, totalMarkets, totalOrders });
});

export const pendingFarmers = asyncHandler(async (req, res) => {
  const list = await User.find({ role: 'farmer', isApproved: false })
    .select('name email phone createdAt');
  return ok(res, list);
});

export const approveFarmer = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  ).select('-passwordHash');
  if (!user) return fail(res, 'Farmer not found', 404);
  return ok(res, user, 'Farmer approved');
});

export const suspendFarmer = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  ).select('-passwordHash');
  if (!user) return fail(res, 'Farmer not found', 404);
  return ok(res, user, 'Farmer suspended');
});

export const listFarmers = asyncHandler(async (req, res) => {
  const list = await User.find({ role: 'farmer' })
    .select('name email phone isActive isApproved createdAt');
  return ok(res, list);
});

export const listCustomers = asyncHandler(async (req, res) => {
  const list = await User.find({ role: 'customer' })
    .select('name email phone isActive createdAt');
  return ok(res, list);
});

export const setCustomerStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  ).select('-passwordHash');
  if (!user) return fail(res, 'Customer not found', 404);
  return ok(res, user, 'Status updated');
});

export const reports = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const completed = await Order.countDocuments({ status: 'completed' });
  const revenue = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  return ok(res, {
    totalOrders,
    completed,
    totalRevenue: revenue[0]?.total || 0,
  });
});