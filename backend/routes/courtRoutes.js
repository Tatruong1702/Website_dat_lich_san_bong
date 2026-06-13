const Court = require(''); 

exports.getGridCourts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const offset = (page - 1) * limit; 

        const { location, type, min_price, max_price, search } = req.query;

        const queryConditions = {};

        if (location) {
            queryConditions.location = { $regex: location, $options: 'i' };
        }

        if (type) {
            queryConditions.type = type;
        }

        if (min_price || max_price) {
            queryConditions.price_per_hour = {};
            if (min_price) {
                queryConditions.price_per_hour.$gte = parseFloat(min_price); 
            }
            if (max_price) {
                queryConditions.price_per_hour.$lte = parseFloat(max_price); 
            }
        }

        if (search) {
            queryConditions.name = { $regex: search, $options: 'i' };
        }

        const [courts, totalCourts] = await Promise.all([
            Court.find(queryConditions)
                .skip(offset)
                .limit(limit)
                .sort({ createdAt: -1 }), 
            Court.countDocuments(queryConditions)
        ]);

        const totalPages = Math.ceil(totalCourts / limit);

        return res.status(200).json({
            success: true,
            message: "Tải danh sách sân bóng rổ thành công.",
            data: courts,
            pagination: {
                total_items: totalCourts,
                total_pages: totalPages,
                current_page: page,
                per_page: limit,
                has_next_page: page < totalPages,
                has_prev_page: page > 1
            }
        });

    } catch (error) {
        console.error("Error tại getGridCourts:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi hệ thống khi lấy danh sách sân.",
            error: error.message
        });
    }
};