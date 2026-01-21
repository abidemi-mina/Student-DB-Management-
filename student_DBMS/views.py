from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student, AcademicRecord
from .serializer import StudentSerializer, AcademicRecordSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'matriculation_number',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'state_of_origin',
        'local_government_area',
    ]
    filterset_fields = ['gender', 'nationality', 'state_of_origin']
    ordering_fields = ['first_name', 'last_name', 'enrollment_date']
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_students = Student.objects.count()
        by_gender = Student.objects.values('gender').annotate(count=models.Count('id'))
        by_state = Student.objects.values('state_of_origin').annotate(count=models.Count('id'))
        
        return Response({
            'total_students': total_students,
            'by_gender': list(by_gender),
            'by_state': list(by_state),
        })
    
    @action(detail=True, methods=['get'])
    def academic_records(self, request, pk=None):
        student = self.get_object()
        records = AcademicRecord.objects.filter(student=student)
        serializer = AcademicRecordSerializer(records, many=True)
        return Response(serializer.data)

class AcademicRecordViewSet(viewsets.ModelViewSet):
    queryset = AcademicRecord.objects.all()
    serializer_class = AcademicRecordSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['student', 'semester', 'level', 'grade']
    search_fields = ['course_name', 'student__matriculation_number']
    
    def get_queryset(self):
        queryset = AcademicRecord.objects.all()
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        return queryset

@api_view(['GET'])
def dashboard_stats(request):
    from django.db.models import Count, Avg
    
    total_students = Student.objects.count()
    average_cgpa = AcademicRecord.objects.aggregate(avg_cgpa=Avg('cgpa'))['avg_cgpa'] or 0
    
    # Students by level from latest academic records
    level_stats = AcademicRecord.objects.values('level').annotate(
        count=Count('student', distinct=True)
    ).order_by('level')
    
    return Response({
        'total_students': total_students,
        'average_cgpa': round(average_cgpa, 2),
        'level_stats': list(level_stats),
    })