import InventoryService from '../services/InventoryService.js';

export default class InventoryController {
  constructor() {
    this.inventoryService = new InventoryService();
  }

  getByProductId = async (req, res, next) => {
    try {
      const data = await this.inventoryService.getByProductId(Number(req.params.productId));
      res.json({ success: true, data, message: 'Inventory fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateInventory = async (req, res, next) => {
    try {
      const data = await this.inventoryService.updateInventory(Number(req.params.inventoryId), req.body);
      res.json({ success: true, data, message: 'Inventory updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  getAlerts = async (req, res, next) => {
    try {
      const data = await this.inventoryService.getLowStockAlerts();
      res.json({ success: true, data, message: 'Low stock alerts fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await this.inventoryService.getAllInventoryWithAlerts();
      res.json({ success: true, data, message: 'Inventory fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}
