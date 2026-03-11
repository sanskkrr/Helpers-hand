from django.db import models

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('In Progress', 'In Progress'),
        ('Escalated', 'Escalated'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    CATEGORY_CHOICES = [
        ('Technical', 'Technical'),
        ('Billing', 'Billing'),
        ('Service', 'Service'),
        ('Product', 'Product'),
        ('Delivery', 'Delivery'),
        ('Other', 'Other'),
    ]

    complainant_name = models.CharField(max_length=100)
    complainant_email = models.EmailField()
    complainant_phone = models.CharField(max_length=20)

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)

    subject = models.CharField(max_length=200)
    description = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    @property
    def complaint_code(self):
        return f"CMP-{self.id:03d}"

    def __str__(self):
        return self.subject