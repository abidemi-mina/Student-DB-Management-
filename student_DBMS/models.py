from django.db import models

class Student(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    matriculation_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    state_of_origin = models.CharField(max_length=50)
    local_government_area = models.CharField(max_length=50)
    nationality = models.CharField(max_length=50)
    address = models.TextField()
    enrollment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.matriculation_number} - {self.first_name} {self.last_name}"
    
    class Meta:
        verbose_name_plural = 'Students'
        ordering = ['-created_at']  # Newest first

class AcademicRecord(models.Model):
    SEMESTER_CHOICES = [
        ('First', 'First Semester'),
        ('Second', 'Second Semester'),
        ('Third', 'Third Semester'),
    ]
    
    GRADE_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
    ]
    
    LEVEL_CHOICES = [
        (100, '100 Level'),
        (200, '200 Level'),
        (300, '300 Level'),
        (400, '400 Level'),
        (500, '500 Level'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='academic_records')
    course_name = models.CharField(max_length=100)
    cgpa = models.FloatField()
    grade = models.CharField(max_length=1, choices=GRADE_CHOICES)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    level = models.IntegerField(choices=LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course_name} - {self.get_grade_display()} (Level {self.level}, {self.get_semester_display()})"

    class Meta:
        verbose_name_plural = 'Academic Records'
        ordering = ['-level', 'course_name']