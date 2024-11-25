import {Component, inject, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonDirective} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FarmerService} from '../../shared/services/farmer.service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [
    TableModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ButtonDirective,
    ReactiveFormsModule
  ],
  templateUrl: './farmer-dashboard.component.html',
  styleUrl: './farmer-dashboard.component.scss'
})
export class FarmerDashboardComponent implements OnInit {
  products: any[] = [];
  addProductDialog: boolean = false;
  selectedImages: File[] = [];
  categories = [
    {label: 'Vegetables', value: 'vegetables'},
    {label: 'Fruits', value: 'fruits'},
    {label: 'Seeds', value: 'seeds'}
  ];

  messageService = inject(MessageService)
  confirmationService = inject(ConfirmationService)
  farmerService = inject(FarmerService)

  protected productForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    quantity: new FormControl('',[ Validators.required]),
    description: new FormControl('',[ Validators.required]),
    images: new FormControl()
  });


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.farmerService.getProducts().subscribe( {
      next: (data:any) => {
        this.products = data;
      },
      error: (err:any) => {
        console.error('Error loading products:', err.message);
      }}
    );
  }

  showAddProductDialog(): void {
    this.addProductDialog = true;
  }

  onFileSelect(event: any): void {
    this.selectedImages = event.target.files;
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.value['name']);
    formData.append('category',this.productForm.value['category']);
    formData.append('price', this.productForm.value['price']);
    formData.append('quantity', this.productForm.value['quantity']);
    formData.append('description', this.productForm.value['description']);

    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('images', this.selectedImages[i]);
    }

    this.farmerService.addProduct(formData).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Product added successfully'});
          this.loadProducts();
          this.addProductDialog = false;
          this.productForm.reset();
          this.selectedImages = [];
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error ' + err.message
          });
          console.error('Error adding product:', err);
        }
      }
    );
  }

  editProduct(productId: string): void {
    // Implement edit product logic
  }

  deleteProduct(productId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      accept: () => {
        this.farmerService.deleteProduct(productId).subscribe({
            next:

              () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Product deleted successfully'
                });
                this.loadProducts();
              },
            error: (err: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error ' + err.message
              });
              console.error('Error deleting product:', err);
            }
          }
        );
      }
    });
  }
}
