from rest_framework import serializers
from .models import Student, AcademicRecord

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id',
            'matriculation_number',
            'first_name',
            'middle_name',
            'last_name',
            'date_of_birth',
            'gender',
            'email',
            'phone_number',
            'state_of_origin',
            'local_government_area',
            'nationality',
            'address',
            'enrollment_date',
        ]

class AcademicRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.first_name', read_only=True)
    student_matric = serializers.CharField(source='student.matriculation_number', read_only=True)
    
    class Meta:
        model = AcademicRecord
        fields = [
            'id',
            'student',
            'student_name',
            'student_matric',
            'course_name',
            'cgpa',
            'grade',
            'semester',
            'level',
        ]