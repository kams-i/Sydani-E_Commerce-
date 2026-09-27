import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../config/database.ts';

// Define fixed categories to match frontend options
export const ProductCategory = {
    HAIR_EXTENSIONS: 'Hair Extensions',
    HAIR_TOOLS: 'Hair Tools',
    ACCESSORIES: 'Accessories',
    WIGS: 'Wigs',
    OILS: 'Oils',
    MORE: 'More',
} as const;

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];

export interface ProductAttributes {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    category: ProductCategory;
    images?: string[] | null;
    sellerId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'images' | 'stock' | 'category'> { }

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public declare id: string;
    public declare title: string;
    public declare description: string;
    public declare price: number;
    public declare stock: number;
    public declare category: ProductCategory;
    public declare images: string[] | null;
    public declare sellerId: string;

    public declare readonly createdAt: Date;
    public declare readonly updatedAt: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        category: {
            type: DataTypes.ENUM(...Object.values(ProductCategory)),
            allowNull: false,
            defaultValue: ProductCategory.HAIR_EXTENSIONS,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            field: 'images',
        },
        sellerId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'seller_id',
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'products',
        timestamps: true,
        underscored: true,
    }
);

export default Product;